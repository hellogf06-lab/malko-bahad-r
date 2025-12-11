import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, UploadCloud, CheckCircle2, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// 1. Validasyon Şeması
const formSchema = z.object({
  title: z.string().min(2, "En az 2 karakter girmelisiniz."),
  amount: z.coerce.number().positive("Tutar 0'dan büyük olmalı."),
  category: z.string({ required_error: "Kategori seçiniz." }),
  date: z.date({ required_error: "Tarih seçiniz." }),
  docNo: z.string().optional(),
  file: z.any().optional(), // Dosya alanı
});

interface ExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any; // Düzenleme modu için
}

export function ExpenseSheet({ open, onOpenChange, onSubmit, initialData }: ExpenseSheetProps) {
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.aciklama || "",
      amount: initialData?.tutar || 0,
      category: initialData?.kategori || "",
      docNo: initialData?.belge_no || "",
      date: initialData?.tarih ? new Date(initialData.tarih) : new Date(),
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto w-full">
        <SheetHeader className="mb-6 bg-rose-50 -mx-6 -mt-6 p-6 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-rose-600 shadow-sm">
                <DollarSign size={20} />
            </div>
            <div>
                <SheetTitle className="text-xl font-bold text-slate-800">
                    {initialData ? "Gideri Düzenle" : "Yeni Gider İşlemi"}
                </SheetTitle>
                <SheetDescription className="text-rose-600/80">
                    Ofis harcamalarını ve faturalarını kaydedin.
                </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-1">
            
            {/* --- GRUP 1: Temel Bilgiler --- */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Finansal Detaylar</h4>
                
                <div className="grid grid-cols-2 gap-4">
                    {/* Tutar Alanı */}
                    <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tutar (₺)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₺</span>
                                <Input type="number" className="pl-8 font-bold text-lg bg-white" placeholder="0.00" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Tarih Seçici */}
                    <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>İşlem Tarihi</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal bg-white",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "d MMMM yyyy", { locale: tr })
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
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
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

            {/* --- GRUP 2: Detaylar --- */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama / Başlık</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Ofis Kırtasiye Alışverişi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="kira">Ofis Kirası</SelectItem>
                        <SelectItem value="ulasim">Ulaşım / Benzin</SelectItem>
                        <SelectItem value="yemek">Yemek / Temsil</SelectItem>
                        <SelectItem value="maas">Personel Maaş</SelectItem>
                        <SelectItem value="kirtasiye">Kırtasiye</SelectItem>
                        <SelectItem value="fatura">Elektrik/Su/Net</SelectItem>
                        <SelectItem value="diger">Diğer</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="docNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fiş / Belge No</FormLabel>
                    <FormControl>
                        <Input placeholder="A-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
                />
            </div>

            {/* --- GRUP 3: Dosya Yükleme --- */}
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Fiş Görseli (Opsiyonel)</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative bg-slate-50/50">
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                            <UploadCloud size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-700">Dosya Seçmek İçin Tıkla</p>
                        <p className="text-xs text-slate-400 mt-1">JPG, PNG veya PDF</p>
                        
                        {/* Gizli ama tüm alanı kaplayan input */}
                        <Input 
                            {...fieldProps}
                            type="file" 
                            accept="image/*,application/pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(event) => {
                                onChange(event.target.files && event.target.files[0]);
                            }}
                        />
                        {/* Seçilen Dosya İsmi Gösterimi */}
                        {value && (
                            <div className="mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                Seçildi: {value.name}
                            </div>
                        )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 h-11 text-base shadow-lg shadow-rose-900/20">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    {initialData ? "Değişiklikleri Kaydet" : "Gideri Kaydet"}
                </Button>
            </SheetFooter>

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
