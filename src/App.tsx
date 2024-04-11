import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import parseEvaDtsFile from "@/lib/parser";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { config } from "process";

function App() {

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    quoteStrings: true,
    decimalSeparator: '.',
    showColumnHeaders: true,
    showTitle: false,
    title: 'Products',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  });

  useEffect(() => {

    const parse = async () => {
      const request = await fetch('/sample.txt');
      const content = await request.text();

      const result = parseEvaDtsFile(content);
      console.log(result);
      const csv = generateCsv(csvConfig)(result);
      download(csvConfig)(csv);
    };

    parse();
  });

  return (
    <>
      <Button>Click me</Button>
    </>
  )
}

export default App
