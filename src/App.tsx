import { Button } from "@/components/ui/button"
import { ChangeEvent, useState } from "react"
import parseEvaDtsFile from "@/lib/parser";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { LoadingButton } from "./components/loading-button";

function App() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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

  function handleFileChanged(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files || !event.target.files[0]) return;

    setFile(event.target.files[0]);
  }

  function submit() {
    if(!file)
        return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result
      const result = parseEvaDtsFile(content);
      const csv = generateCsv(csvConfig)(result);
      download(csvConfig)(csv);

      setTimeout(() => {
        setLoading(false);
      }, 1000);

      toast("Konvertierung erfolgreich", {
        description: "Die konvertierte Datei wird jetzt heruntergeladen."
      })
    };

    reader.readAsText(file); // Read file as text
  }

  return (
    <>        
      <Toaster />
      <div className="flex flex-col justify-center items-center h-full gap-3">
        <div className="w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file">EVADTS Datei</Label>
          <Input id="file" type="file" accept=".txt" onChange={handleFileChanged} />
        </div>
        <LoadingButton size="lg" loading={loading} onClick={submit} disabled={file === null}>
          Start
        </LoadingButton>
      </div>
    </>
  )
}

export default App
