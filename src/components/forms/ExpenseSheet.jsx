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

export function ExpenseSheet({ open, onOpenChange, onSubmit, editData = null }) {
  
  // Test formu kaldırıldı. Gerçek uygulama kodu burada olmalı.
  return null;
}
