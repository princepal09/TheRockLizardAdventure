import React from "react";

interface TrekPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const Trek = async ({ params }: TrekPageProps) => {
  const { slug } = await params;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">Trek Details</h1>
      <p className="mt-2 text-gray-300">
        Viewing details: <span className="text-sky-400">{slug}</span>
      </p>
    </div>
  );
};

export default Trek;
