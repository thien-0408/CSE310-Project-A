/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useState } from "react";
import ConfirmModal, { ConfirmStatus } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/button";

export default function testConfirmModal() {
  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: ConfirmStatus;
    message: string;
    title?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    status: "ask",
    message: "",
    onConfirm: () => {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const confirmAction = (
    status: ConfirmStatus,
    title: string,
    message: string,
    action: () => Promise<void>
  ) => {
    setModal({
      isOpen: true,
      status,
      title,
      message,
      onConfirm: async () => {
        setIsLoading(true);
        await action(); // Gọi hàm xử lý API
        setIsLoading(false);
        setModal((prev) => ({ ...prev, isOpen: false })); // Đóng modal sau khi xong
      },
    });
  };
  const handleDelete = () => {
    confirmAction(
      "alert",
      "Delete Test?",
      "This action cannot be undone. All user results associated with this test will be permanently removed.",
      async () => {
        // Giả lập gọi API xóa
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Deleted!");
      }
    );
  };

  const handleDeactivate = () => {
    confirmAction(
      "warning",
      "Deactivate User",
      "Are you sure you want to deactivate this user? They won't be able to login until reactivated.",
      async () => {
        console.log("User deactivated");
      }
    );
  };

  const handleSubmit = () => {
    confirmAction(
      "ask",
      "Submit Test",
      "Are you sure you want to submit your test? You cannot change your answers after submission.",
      async () => {
        console.log("Test submitted");
      }
    );
  };
  return (
    <>
      <Button onClick={handleDelete} variant="destructive">
        Delete Item
      </Button>
      <Button
        onClick={handleDeactivate}
        className="bg-amber-500 hover:bg-amber-600"
      >
        Deactivate User
      </Button>
      <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
        Submit Test
      </Button>
      <ConfirmModal
        isOpen={modal.isOpen}
        onClose={() => setModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={modal.onConfirm}
        status={modal.status}
        title={modal.title}
        message={modal.message}
        isLoading={isLoading}
      />
    </>
  );
}
