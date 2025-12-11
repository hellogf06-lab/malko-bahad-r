import { useState } from "react";
import { addGider } from '../../services/supabaseApi';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
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


export function ExpenseSheet({ open, onOpenChange, onSubmit, initialData = null }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      amount: '',
      category: '',
      date: new Date(),
      docNo: '',
      file: null
    }
  });

  const handleSubmit = async (values) => {
    if (onSubmit) onSubmit(values);
    if (onOpenChange) onOpenChange(false);
    form.reset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="max-w-md w-full">
        <SheetHeader>
          <SheetTitle>Yeni Ofis Gideri Ekle</SheetTitle>
          <SheetDescription>Ofis giderinizi kaydedin.</SheetDescription>
        </SheetHeader>
        <Form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input placeholder="Açıklama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutar</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="">
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçiniz" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kırtasiye">Kırtasiye</SelectItem>
                        <SelectItem value="Ulaşım">Ulaşım</SelectItem>
                        <SelectItem value="Yemek">Yemek</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarih</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}> 
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "dd MMMM yyyy", { locale: tr }) : "Tarih seçiniz"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="docNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiş No (isteğe bağlı)</FormLabel>
                  <FormControl>
                    <Input placeholder="Fiş No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700">Kaydet</Button>
            </SheetFooter>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
