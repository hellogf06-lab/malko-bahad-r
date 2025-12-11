import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, CalendarIcon, CheckCircle2, Receipt } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import * as React from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "../../lib/utils";

const formSchema = z.object({
  fileId: z.string({ required_error: "Dosya seçiniz" }),
  expenseType: z.enum(["harc", "posta", "noter", "bilirkisi", "tapu", "tercume", "ulasim", "diger"], {
    errorMap: () => ({ message: "Masraf türü seçiniz" })
  }),
  amount: z.coerce.number().positive("Tutar 0'dan büyük olmalıdır"),
  date: z.date({ required_error: "Tarih seçiniz" }),
  notes: z.string().optional(),
});

export function LegalExpenseSheet({ open, onOpenChange, onSubmit, dosyalar = [], editData = null }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expenseType: "harc",
      amount: 0,
      notes: "",
    },
  });

  // EDIT MODE: Form verilerini doldur
  React.useEffect(() => {
    if (editData) {
      form.reset({
        fileId: editData.dosya_id?.toString() || "",
        expenseType: editData.masraf_turu || "harc",
        amount: editData.tutar || 0,
        date: editData.tarih ? new Date(editData.tarih) : new Date(),
        notes: editData.notes || "",
      });
    } else {
      form.reset({
        expenseType: "harc",
        amount: 0,
        notes: "",
      });
    }
  }, [editData, form]);

  function handleSubmit(values) {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="mb-6 bg-slate-50 -mx-6 -mt-6 p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
              <FileText size={20} />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-slate-800">
                {editData ? "Masraf Düzenle" : "Yeni Dosya Masrafı"}
              </SheetTitle>
              <SheetDescription>
                {editData ? "Masraf bilgilerini güncelleyin." : "Dosyaya ait masraf kaydı oluşturun."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* BÖLÜM 1: FİNANSAL */}
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Receipt size={16} className="text-orange-600" />
                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest">Masraf Tutarı</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tutar (₺)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₺</span>
                          <Input type="number" className="pl-8 font-semibold text-lg" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tarih</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: tr })
                              ) : (
                                <span>Tarih Seçin</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* BÖLÜM 2: DOSYA SEÇİMİ */}
            <FormField
              control={form.control}
              name="fileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosya Seçimi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Dosya seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dosyalar && dosyalar.length > 0 ? (
                        dosyalar.map((dosya) => (
                          <SelectItem key={dosya.id} value={dosya.id.toString()}>
                            {dosya.dosya_no} - {dosya.muvekkil_adi}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-files" disabled>
                          Kayıtlı dosya yok
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BÖLÜM 3: MASRAF TÜRÜ */}
            <FormField
              control={form.control}
              name="expenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masraf Türü</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçiniz" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="harc">Harç</SelectItem>
                      <SelectItem value="posta">Posta / Kargo</SelectItem>
                      <SelectItem value="noter">Noter</SelectItem>
                      <SelectItem value="bilirkisi">Bilirkişi</SelectItem>
                      <SelectItem value="tapu">Tapu</SelectItem>
                      <SelectItem value="tercume">Tercüme</SelectItem>
                      <SelectItem value="ulasim">Ulaşım</SelectItem>
                      <SelectItem value="diger">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BÖLÜM 4: NOTLAR */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama / Notlar</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Masraf ile ilgili ek bilgiler..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4 pb-2">
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base shadow-xl">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Masrafı Kaydet
              </Button>
            </SheetFooter>

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
