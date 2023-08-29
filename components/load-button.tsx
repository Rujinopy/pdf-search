"use client";

export default function LoadButton(props: any) {

  return (
    <div>
      <button
        onClick={props.onload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Load PDF
      </button>
    </div>
  );
}
