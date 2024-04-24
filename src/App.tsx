import { ChangeEvent, useState } from "react"
import parseEvaDtsFile, { ParseResult } from "@/lib/parser";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { LoadingButton } from "./components/loading-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Button } from "./components/ui/button";
import { number } from "currency-codes";

function App() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParseResult | null>(null);
  const [currency, setCurrency] = useState<string>("EUR");

  function handleFileChanged(event: ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files || !event.target.files[0]) return;

    setFile(event.target.files[0]);
  }

  function submit() {
    if (!file)
      return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target || !e.target.result) return;

      const content = e.target.result as string;
      const result = parseEvaDtsFile(content);
      
      const currentCurrency = number(result.currencyNumber as unknown as string);
      if (currentCurrency) {
        setCurrency(currentCurrency.code);
      }

      setTimeout(() => {
        toast("Datei erfolgreich verarbeitet.");
        setLoading(false);
        setResult(result);
      }, 1000);

    };

    reader.readAsText(file); // Read file as text
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("de-AT", { style: "currency", currency: currency }).format(value);
  }

  return (
    <>
      <Toaster />
      <div className="flex flex-col justify-center items-center h-full gap-3">
        {!result && <>
          <div className="w-full max-w-md items-center gap-1.5">
            <Label htmlFor="file">EVADTS Datei</Label>
            <Input id="file" type="file" accept=".txt" onChange={handleFileChanged} />
          </div>
          <LoadingButton size="lg" loading={loading} onClick={submit} disabled={file === null}>
            Start
          </LoadingButton>
        </>}
        {result && <>
          <div className="h-full">
            <div className="flex flex-row justify-between items-center gap-10 my-5">
              <div className="flex flex-col">
                <h1 className="text-xl font-medium">Auswertung</h1>
                <p className="text-sm text-muted-foreground">Seit dem letzten Zurücksetzen der Verkaufsstatistiken</p></div>
              <Button variant={"secondary"} onClick={() => { setResult(null); setFile(null); }}>Neue Auswertung starten</Button>
            </div>
            <Table className="mb-10 w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Zahlungsart</TableHead>
                  <TableHead className="w-[150px] text-right">Anzahl Verkäufe</TableHead>
                  <TableHead className="w-[150px] text-right">Umsatz</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.paymentMethods.map((p) => (
                  <TableRow key={p.title}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-right">{p.numberOfSales}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.valueOfSales)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Fach</TableHead>
                  <TableHead className="text-left">Einzelpreis</TableHead>
                  <TableHead className="w-[150px] text-right">Anzahl Verkäufe</TableHead>
                  <TableHead className="w-[150px] text-right">Umsatz</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell className="text-left">{formatCurrency(p.price)}</TableCell>
                    <TableCell className="text-right">{p.numberOfSales}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.valueOfSales)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>}
      </div>
    </>
  )
}

export default App
