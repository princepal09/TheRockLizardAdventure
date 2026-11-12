import type { JSONContent } from "@tiptap/react";
import { Fragment, type ReactNode } from "react";

const orderedListStyles: Readonly<Record<string, string>> = {
  a: "list-[lower-alpha]",
  A: "list-[upper-alpha]",
  i: "list-[lower-roman]",
  I: "list-[upper-roman]",
};

function renderNode(node: JSONContent): ReactNode {
  if (node.type === "text") {
    let text: ReactNode = node.text;
    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") text = <strong>{text}</strong>;
      if (mark.type === "underline") text = <u>{text}</u>;
    }
    return text;
  }

  const children = node.content?.map((child, index) => (
    <Fragment key={index}>{renderNode(child)}</Fragment>
  ));

  switch (node.type) {
    case "doc":
      return children;
    case "paragraph":
      return <p>{children?.length ? children : <br />}</p>;
    case "hardBreak":
      return <br />;
    case "bulletList":
      return <ul className="list-disc pl-6">{children}</ul>;
    case "orderedList":
      return (
        <ol
          className={`pl-6 ${orderedListStyles[node.attrs?.type] ?? "list-decimal"}`}
          start={node.attrs?.start}
        >
          {children}
        </ol>
      );
    case "listItem":
      return <li>{children}</li>;
    default:
      return null;
  }
}

export default function TripDescription({
  description,
  richDescription,
}: {
  description: string | null;
  richDescription?: JSONContent | null;
}) {
  const className = "max-w-4xl whitespace-pre-line text-sm leading-relaxed text-slate-700";
  if (richDescription) {
    return <div className={`${className} space-y-2`}>{renderNode(richDescription)}</div>;
  }
  return description ? <p className={className}>{description}</p> : null;
}
