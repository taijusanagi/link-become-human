import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`${inter.className}`}>
      <iframe width="500" height="500" src="/game/index.html"></iframe>
    </main>
  );
}
