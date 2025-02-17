import React from "react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg lg:w-96 w-[450px] ">
        <h2 className="text-lg font-semibold text-center">Please confirm if you wish to</h2>
        <h3 className="text-red-600 text-center font-bold">delete the post</h3>
        <p className="text-gray-600 text-center mt-2">
          Are you sure you want to delete the post? <br />
          Once deleted, it cannot be recovered.
        </p>
        <div className="flex flex-col justify-center mt-4  gap-2">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md">
            Delete
          </button>
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
