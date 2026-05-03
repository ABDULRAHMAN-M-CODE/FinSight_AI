import { useEffect, useState } from "react";

export default function StreamViewer() {
  const [numbers, setNumbers] = useState<number[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/stream");

    eventSource.onmessage = (event) => {
      // backend sends: data: 1
      const value = event.data;

      setNumbers((prev) => [...prev, value]);
    };

    eventSource.onerror = () => {
      console.log("Connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div>
      <h2>Stream from backend</h2>
      {numbers.map((n, i) => (
        <div key={i}>{n}</div>
      ))}
    </div>
  );
}