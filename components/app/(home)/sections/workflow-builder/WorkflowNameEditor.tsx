// "use client";

// import { useState, useEffect, ReactNode } from "react";
// import { Workflow } from "@/lib/workflow/types";

// interface WorkflowNameEditorProps {
//   workflow: Workflow | null;
//   onUpdate: (updates: Partial<Workflow>) => void;
//   renameTrigger?: number;
//   rightAccessory?: ReactNode;
// }

// export default function WorkflowNameEditor({
//   workflow,
//   onUpdate,
//   renameTrigger = 0,
//   rightAccessory,
// }: WorkflowNameEditorProps) {
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingDesc, setIsEditingDesc] = useState(false);

//   const [name, setName] = useState(workflow?.name || "New Workflow");
//   const [description, setDescription] = useState(workflow?.description || "");

//   // Sync name + description when workflow changes
//   useEffect(() => {
//     if (workflow) {
//       setName(workflow.name);
//       setDescription(workflow.description || "");
//     }
//   }, [workflow]);

//   // External trigger
//   useEffect(() => {
//     if (renameTrigger > 0) {
//       setIsEditingName(true);
//     }
//   }, [renameTrigger]);

//   const saveName = () => {
//     if (!name.trim()) return;
//     onUpdate({ name: name.trim() });
//     setIsEditingName(false);
//   };

//   const saveDescription = () => {
//     onUpdate({ description: description.trim() });
//     setIsEditingDesc(false);
//   };

//   const handleNameKey = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") saveName();
//     if (e.key === "Escape") {
//       setName(workflow?.name || "New Workflow");
//       setIsEditingName(false);
//     }
//   };

//   const handleDescKey = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") saveDescription();
//     if (e.key === "Escape") {
//       setDescription(workflow?.description || "");
//       setIsEditingDesc(false);
//     }
//   };

//   if (!workflow) return null;

//   return (
//     <div className="fixed top-20 left-240 z-[60]">
//       {/* NAME FIELD */}
//       <div className="flex items-center gap-12 relative">
//         {isEditingName ? (
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             onBlur={saveName}
//             onKeyDown={handleNameKey}
//             autoFocus
//             className="px-16 py-8 bg-accent-white border border-heat-100 rounded-8 text-body-medium text-accent-black shadow-lg min-w-200 focus:outline-none"
//           />
//         ) : (
//           <button
//             onClick={() => setIsEditingName(true)}
//             className="px-16 py-8 bg-accent-white border border-border-faint hover:border-heat-100 rounded-8 text-body-medium text-accent-black transition-colors flex items-center gap-8"
//           >
//             <span>{name}</span>
//             <svg
//               className="w-14 h-14 text-black-alpha-48 group-hover:text-heat-100"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
//               />
//             </svg>
//           </button>
//         )}

//         {rightAccessory && (
//           <div className="flex items-center gap-8">{rightAccessory}</div>
//         )}

//         {/* DESCRIPTION FIELD (ABSOLUTE) */}
//         <div className="absolute top-[60px] left-0">
//           {isEditingDesc ? (
//             <input
//               type="text"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               onBlur={saveDescription}
//               onKeyDown={handleDescKey}
//               autoFocus
//               className="px-16 py-8 bg-accent-white border border-heat-100 rounded-8 text-body-medium text-accent-black shadow-lg min-w-240 focus:outline-none"
//             />
//           ) : (
//             <button
//               onClick={() => setIsEditingDesc(true)}
//               className="px-16 py-8 bg-accent-white border border-border-faint hover:border-heat-100 rounded-8 text-body-medium text-accent-black transition-colors text-left min-w-240"
//             >
//               {description || (
//                 <span className="text-black-alpha-48">Add description…</span>
//               )}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Workflow } from "@/lib/workflow/types";

interface WorkflowNameEditorProps {
  workflow: Workflow | null;
  onUpdate: (updates: Partial<Workflow>) => void;
  renameTrigger?: number;
  rightAccessory?: React.ReactNode;
}

export default function WorkflowNameEditor({
  workflow,
  onUpdate,
  renameTrigger = 0,
  rightAccessory,
}: WorkflowNameEditorProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(workflow?.name || "New Workflow");
  const [description, setDescription] = useState(workflow?.description || "");

  // Sync fields when workflow changes
  useEffect(() => {
    if (workflow) {
      setName(workflow.name);
      setDescription(workflow.description || "");
    }
  }, [workflow]);

  useEffect(() => {
    if (renameTrigger > 0) {
      setOpen(true);
    }
  }, [renameTrigger]);

  if (!workflow) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onUpdate({
      name: name.trim(),
      description: description.trim(),
    });
    setOpen(false);
  };

  return (
    <>
      <div className="fixed top-20 left-240 z-[60] flex items-center gap-12">
        <button
          onClick={() => setOpen(true)}
          className="px-16 py-8 bg-accent-white border border-border-faint hover:border-heat-100 rounded-8 text-body-medium text-accent-black transition-colors flex items-center gap-8"
        >
          <span>{workflow.name}</span>
          <svg
            className="w-14 h-14 text-black-alpha-48 group-hover:text-heat-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>

        {rightAccessory && (
          <div className="flex items-center gap-8">{rightAccessory}</div>
        )}
      </div>

      {/* Dialog */}
      <EditWorkflowDialog
        open={open}
        setOpen={setOpen}
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
        onSave={handleSave}
      />
    </>
  );
}

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  name: string;
  description: string;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  onSave: () => void;
}

function EditWorkflowDialog({
  open,
  setOpen,
  name,
  description,
  setName,
  setDescription,
  onSave,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white w-[400px] p-20 rounded-12 shadow-xl space-y-10">
        <h2 className="text-title-medium">Edit Workflow Details</h2>

        <div className="space-y-12">
          <div>
            <label className="block mb-4 text-body-small text-black-alpha-64">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-12 py-8 border rounded-8 focus:border-heat-100 focus:outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block mb-4 text-body-small text-black-alpha-64">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-12 py-8 border rounded-8 focus:border-heat-100 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-12">
          <button
            onClick={() => setOpen(false)}
            className="px-16 py-8 text-body-medium text-black-alpha-64 hover:text-accent-black"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-20 py-8 bg-heat-100 text-white rounded-8 hover:bg-heat-100/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
