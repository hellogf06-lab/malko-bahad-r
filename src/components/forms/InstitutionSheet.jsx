import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Calculator, Save } from "lucide-react";
import * as React from "react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "../ui/sheet";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

// 1. Validasyon Şeması
const institutionSchema = z.object({
  institutionName: z.string().min(2, "Kurum adı seçiniz."),
  fileNo: z.string().min(3, "Dosya numarası giriniz."),
  baseAmount: z.coerce.number().min(0, "Tutar giriniz."), // Tahsilat Tutarı
  rate: z.coerce.number().min(0).max(100), // Vekalet Oranı (%)
  netAmount: z.coerce.number(), // Otomatik hesaplanacak
  status: z.string().default("bekliyor"), // ödendi / bekliyor
  notes: z.string().optional(),
});

export function InstitutionSheet({ open, onOpenChange, onSubmit, editData = null }) {
  
  const form = useForm({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      institutionName: "",
      fileNo: "",
      baseAmount: 0,
      rate: 10, // Varsayılan %10
      netAmount: 0,
      status: "bekliyor",
      notes: ""
    },
  });

  // EDIT MODE: Form verilerini doldur
  React.useEffect(() => {
    if (editData) {
      form.reset({
        institutionName: editData.kurum_adi || "",
        fileNo: editData.dosya_no || "",
        baseAmount: editData.tahsil_tutar || 0,
        rate: editData.vekalet_orani || 10,
        netAmount: editData.net_hakedis || 0,
        status: editData.odendi ? "odendi" : "bekliyor",
        notes: editData.notes || "",
      });
    } else {
      form.reset({
        institutionName: "",
        fileNo: "",
        baseAmount: 0,
        rate: 10,
        netAmount: 0,
        status: "bekliyor",
        notes: ""
      });
    }
  }, [editData, form]);

  // 2. OTOMATİK HESAPLAMA MOTORU 🧮
  // Tutar veya Oran değiştiğinde Net Tutarı güncelle
  const baseAmount = form.watch("baseAmount");
  const rate = form.watch("rate");

  useEffect(() => {
    if (baseAmount > 0 && rate > 0) {
      const calculated = (baseAmount * rate) / 100;
      form.setValue("netAmount", calculated); // Sonucu forma yaz
    }
  }, [baseAmount, rate, form]);

  function handleSubmit(values) {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6 bg-indigo-50 -mx-6 -mt-6 p-6 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                <Building2 size={20} />
            </div>
            <div>
                <SheetTitle className="text-xl font-bold text-slate-800">
                  {editData ? "Hakediş Düzenle" : "Kurum Hakedişi"}
                </SheetTitle>
                <SheetDescription className="text-indigo-600/80">
                  {editData ? "Hakediş bilgilerini güncelleyin." : "Kurumdan alınacak ödemeyi hesaplayın."}
                </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kurum Adı</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kurum Seç" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="adalet">Adalet Bakanlığı</SelectItem>
                          <SelectItem value="sgk">SGK</SelectItem>
                          <SelectItem value="maliye">Maliye Bakanlığı</SelectItem>
                          <SelectItem value="tmob">Türkiye Barolar Birliği</SelectItem>
                          <SelectItem value="sigorta">Sigorta Şirketi</SelectItem>
                          <SelectItem value="diger">Diğer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fileNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosya No</FormLabel>
                      <FormControl>
                        <Input placeholder="2024/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            {/* --- HESAPLAMA ALANI (Vurgulu) --- */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <Calculator size={16} className="text-slate-400" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hakediş Hesaplama</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="baseAmount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tahsilat Tutarı (₺)</FormLabel>
                            <FormControl>
                                <Input type="number" className="bg-white" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Vekalet Oranı (%)</FormLabel>
                            <FormControl>
                                <Input type="number" className="bg-white" {...field} />
                            </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                {/* OTOMATİK HESAPLANAN ALAN (Read Only) */}
                <FormField
                    control={form.control}
                    name="netAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-emerald-600 font-bold">Net Hakediş (Otomatik)</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input 
                                    {...field} 
                                    readOnly 
                                    className="bg-emerald-50 border-emerald-200 text-emerald-700 font-bold text-lg text-right pr-4" 
                                />
                            </div>
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ödeme Durumu</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bekliyor">⏳ Ödeme Bekleniyor</SelectItem>
                      <SelectItem value="odendi">✅ Tahsil Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ödeme tarihi veya ilgili memur..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4">
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-base shadow-lg shadow-indigo-900/20">
                    <Save className="mr-2 h-5 w-5" />
                    Hakedişi Kaydet
                </Button>
            </SheetFooter>

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
