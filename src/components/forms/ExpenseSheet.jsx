import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, UploadCloud, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import * as React from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "../../lib/utils";

// 1. Validasyon Şeması (Kurallar Burada Belirlenir)
const formSchema = z.object({
  title: z.string().min(2, "En az 2 karakter girmelisiniz."),
  amount: z.coerce.number().positive("Tutar 0'dan büyük olmalı."), // String'i sayıya çevirir
  category: z.string({ required_error: "Kategori seçiniz." }),
  date: z.date({ required_error: "Tarih seçiniz." }),
  docNo: z.string().optional(), // Fiş No (İsteğe bağlı)
  file: z.any().optional(), // Dosya (İsteğe bağlı)
});

export function ExpenseSheet({ open, onOpenChange, onSubmit, editData = null }) {
  
  // 2. Form Motorunu Başlat
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: 0,
      docNo: "",
    },
  });

  // EDIT MODE: Form verilerini doldur
  React.useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.aciklama || "",
        amount: editData.tutar || 0,
        category: editData.kategori || "",
        date: editData.tarih ? new Date(editData.tarih) : new Date(),
        docNo: editData.notes || "",
      });
    } else {
      form.reset({
        title: "",
        amount: 0,
        docNo: "",
      });
    }
  }, [editData, form]);

  // 3. Gönderme İşlemi
  function handleSubmit(values) {
    // Burada verileri düzenleyip üst bileşene yolluyoruz
    onSubmit(values);
    form.reset(); // Formu temizle
    onOpenChange(false); // Paneli kapat
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-slate-800">
            {editData ? "Gider Düzenle" : "Yeni Gider İşlemi"}
          </SheetTitle>
          <SheetDescription>
            {editData ? "Gider bilgilerini güncelleyin." : "Fatura veya fiş detaylarını girerek gider kaydı oluşturun."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* --- GRUP 1: Temel Bilgiler --- */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Finansal Detaylar</h4>
                
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
                                <Input type="number" className="pl-8 font-semibold text-lg" placeholder="0.00" {...field} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    {/* Tarih Seçici (Shadcn Calendar) */}
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
                            <SelectValue placeholder="Kategori Seç" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="kira">Ofis Kirası</SelectItem>
                        <SelectItem value="ulasim">Ulaşım / Benzin</SelectItem>
                        <SelectItem value="yemek">Yemek / Temsil</SelectItem>
                        <SelectItem value="kirtasiye">Kırtasiye</SelectItem>
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
                  <FormLabel>Fiş Görseli</FormLabel>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center text-center">
                          <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                            <UploadCloud size={20} />
                          </div>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/*,application/pdf"
                            className="cursor-pointer"
                            onChange={(event) => {
                              onChange(event.target.files && event.target.files[0]);
                            }}
                          />
                          <p className="text-xs text-slate-400 mt-2">JPG, PNG veya PDF</p>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg shadow-blue-900/20">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Kaydet ve İşle
                </Button>
            </SheetFooter>

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
