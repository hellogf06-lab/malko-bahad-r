import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, Gavel, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
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
  fileNo: z.string().min(3, "Dosya numarası giriniz (Örn: 2024/123)"),
  clientName: z.string().min(2, "Müvekkil adı zorunludur."),
  opponentName: z.string().optional(),
  court: z.string().min(3, "Mahkeme/Kurum adı giriniz."),
  type: z.enum(["ceza", "hukuk", "is", "aile", "icra", "danismanlik"], {
    errorMap: () => ({ message: "Dava türü seçiniz." })
  }),
  hearingDate: z.date().optional(),
  status: z.string().default("acik"),
  agreedFee: z.coerce.number().min(0).default(0),
  collectedFee: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
});

export function FileSheet({ open, onOpenChange, onSubmit, editData = null }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileNo: "",
      clientName: "",
      opponentName: "",
      court: "",
      type: "hukuk",
      hearingDate: undefined,
      agreedFee: 0,
      collectedFee: 0,
      status: "acik",
      notes: "",
    },
  });

  // EDIT MODE: Form verilerini doldur
  React.useEffect(() => {
    if (editData) {
      form.reset({
        fileNo: editData.dosya_no || "",
        clientName: editData.muvekkil_adi || "",
        opponentName: editData.karsi_taraf || "",
        court: editData.mahkeme || "",
        type: editData.dava_turu || "hukuk",
        hearingDate: editData.durusma_tarihi ? new Date(editData.durusma_tarihi) : undefined,
        agreedFee: editData.tahsil_edilecek || 0,
        collectedFee: editData.tahsil_edilen || 0,
        status: editData.durum || "acik",
        notes: editData.notes || "",
      });
    } else {
      form.reset({
        fileNo: "",
        clientName: "",
        opponentName: "",
        court: "",
        type: "hukuk",
        hearingDate: undefined,
        agreedFee: 0,
        collectedFee: 0,
        status: "acik",
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
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <Briefcase size={20} />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-slate-800">
                {editData ? "Dosya Düzenle" : "Yeni Dava Dosyası"}
              </SheetTitle>
              <SheetDescription>
                {editData ? "Dosya bilgilerini güncelleyin." : "Yeni bir hukuki süreç başlatmak için detayları girin."}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* BÖLÜM 1: DAVA KÜNYESİ */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fileNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosya / Esas No</FormLabel>
                    <FormControl>
                      <Input placeholder="2024/105 E." className="font-semibold" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dava Türü</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçiniz" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ceza">Ağır Ceza / Asliye</SelectItem>
                        <SelectItem value="hukuk">Asliye Hukuk / Sulh</SelectItem>
                        <SelectItem value="is">İş Mahkemesi</SelectItem>
                        <SelectItem value="aile">Aile (Boşanma vb.)</SelectItem>
                        <SelectItem value="icra">İcra Takibi</SelectItem>
                        <SelectItem value="danismanlik">Danışmanlık</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="court"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Gavel size={14} className="text-slate-400" /> Mahkeme / İcra Dairesi
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Ankara 12. İş Mahkemesi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duruşma Tarihi */}
            <FormField
              control={form.control}
              name="hearingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-blue-500" /> Duruşma Tarihi
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: tr })
                          ) : (
                            <span>Duruşma tarihini seçin</span>
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
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="h-px bg-slate-200 my-4" />

            {/* BÖLÜM 2: TARAFLAR */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-600 font-semibold">Müvekkil</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Soyad / Şirket" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="opponentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-500">Karşı Taraf</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Soyad / Kurum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* BÖLÜM 3: FİNANSAL */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ücret Bilgileri</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="agreedFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Anlaşılan Ücret (₺)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="collectedFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Peşin Alınan (₺)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* BÖLÜM 4: NOTLAR */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dava Notları</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Dava ile ilgili önemli detaylar, sonraki duruşma tarihi vb..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="pt-4 pb-2">
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-base shadow-xl">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Dosyayı Oluştur
              </Button>
            </SheetFooter>

          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
