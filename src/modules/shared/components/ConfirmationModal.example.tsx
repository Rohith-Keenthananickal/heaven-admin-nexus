import React, { useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';
import { Button } from './ui/button';
import { AlertTriangle, Trash2, Save } from 'lucide-react';

/**
 * Example usage of ConfirmationModal component
 * This file demonstrates various ways to use the ConfirmationModal
 */
export const ConfirmationModalExamples: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Example 1: Simple delete confirmation
  const handleDelete = () => {
    console.log('Item deleted!');
    setIsDeleteModalOpen(false);
  };

  // Example 2: Save confirmation with loading state
  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Data saved!');
    setIsLoading(false);
    setIsSaveModalOpen(false);
  };

  // Example 3: Custom content modal
  const handleCustomAction = () => {
    console.log('Custom action executed!');
    setIsCustomModalOpen(false);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">ConfirmationModal Examples</h2>
      
      {/* Example 1: Delete Confirmation */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">1. Delete Confirmation</h3>
        <Button 
          variant="destructive" 
          onClick={() => setIsDeleteModalOpen(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Item
        </Button>
        
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="destructive"
          icon={<AlertTriangle className="w-12 h-12 text-destructive mx-auto" />}
        />
      </div>

      {/* Example 2: Save with Loading */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">2. Save with Loading State</h3>
        <Button 
          onClick={() => setIsSaveModalOpen(true)}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        
        <ConfirmationModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={handleSave}
          title="Save Changes"
          description="Do you want to save your changes?"
          confirmText="Save"
          cancelText="Discard"
          isLoading={isLoading}
          preventClose={isLoading}
        />
      </div>

      {/* Example 3: Custom Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">3. Custom Content Modal</h3>
        <Button 
          variant="outline" 
          onClick={() => setIsCustomModalOpen(true)}
        >
          Custom Action
        </Button>
        
        <ConfirmationModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onConfirm={handleCustomAction}
          title="Custom Action Required"
          description="This action requires additional information:"
          confirmText="Proceed"
          cancelText="Cancel"
          size="lg"
        >
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Additional details about the action:
            </p>
            <ul className="text-sm space-y-1">
              <li>• This will affect 5 items</li>
              <li>• Estimated time: 2-3 minutes</li>
              <li>• No downtime expected</li>
            </ul>
          </div>
        </ConfirmationModal>
      </div>
    </div>
  );
};

export default ConfirmationModalExamples;
