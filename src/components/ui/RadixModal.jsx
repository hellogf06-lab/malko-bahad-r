import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from './button';
import React from 'react';

export default function RadixModal({ open, onOpenChange, title, description = '', children }) {
  const descId = description ? 'modal-desc' : undefined;
  const contentProps = description
    ? { 'aria-describedby': descId }
    : {};
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content
          {...contentProps}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg sm:max-w-md max-h-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-4 sm:p-6 shadow-lg focus:outline-none overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <X size={20} />
              </Button>
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description id={descId} className="mb-4 text-sm text-gray-500">
              {description}
            </Dialog.Description>
          )}
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
