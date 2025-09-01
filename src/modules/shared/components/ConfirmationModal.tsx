import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export interface ConfirmationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should be closed */
  onClose: () => void;
  /** Function to call when user confirms the action */
  onConfirm: () => void;
  /** Modal title */
  title: string;
  /** Modal description/content */
  description?: string;
  /** Custom content to render in the modal body */
  children?: React.ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Variant for the confirm button */
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Variant for the cancel button */
  cancelVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Whether the confirm button should be disabled */
  isConfirmDisabled?: boolean;
  /** Whether the cancel button should be disabled */
  isCancelDisabled?: boolean;
  /** Whether to show loading state on confirm button */
  isLoading?: boolean;
  /** Custom className for the modal content */
  className?: string;
  /** Whether to prevent closing the modal by clicking outside or pressing escape */
  preventClose?: boolean;
  /** Custom icon to display in the modal */
  icon?: React.ReactNode;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  cancelVariant = 'outline',
  isConfirmDisabled = false,
  isCancelDisabled = false,
  isLoading = false,
  className,
  preventClose = false,
  icon,
  size = 'md',
}) => {
  const handleConfirm = () => {
    if (!isConfirmDisabled && !isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isCancelDisabled && !preventClose) {
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !preventClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          sizeClasses[size],
          className
        )}
        onPointerDownOutside={preventClose ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={preventClose ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          {icon && (
            <div className="flex justify-center mb-4">
              {icon}
            </div>
          )}
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        {children && (
          <div className="py-4">
            {children}
          </div>
        )}
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant={cancelVariant}
            onClick={handleCancel}
            disabled={isCancelDisabled}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Loading...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
