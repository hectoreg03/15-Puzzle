'use client';
import Puzzle from "@/components/puzzle/Puzzle";

export default function Home() {
  return (
    <div className="page">
      <Puzzle columns={4} rows={4}/>
    </div>
  );
}
