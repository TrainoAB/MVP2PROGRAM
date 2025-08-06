import { useState } from "react";
import ExerciseForm from "@/app/components/ExerciseForm/ExerciseForm";
import { ArrowUp, ArrowDown, Trash2, Pencil } from "lucide-react";
import styles from "./ExerciseCard.module.css";

export default function ExerciseCard({
  exercise,
  index,
  onMove,
  onDelete,
  onComplete,
  onSaveEdit,
})
{
  const [isEditing, setIsEditing] = useState(false);

   if (isEditing) {
     return (
       <li className={styles.exerciseCard}>
         <ExerciseForm
           exercise={exercise}
           onSave={(updatedExercise) => {
             onSaveEdit(updatedExercise);
             setIsEditing(false);
           }}
           onCancel={() => setIsEditing(false)}
         />
       </li>
     );
   }

   return (
     <li className={styles.exerciseCard}>
       <div className={styles.orderWrapper}>
         <h3 className={styles.exerciseTitle}>{exercise.title}</h3>
         <span className={styles.exerciseOrder}>{index + 1}</span>
       </div>

       <p className={styles.exerciseDuration}>
         Varaktighet: {exercise.duration} minuter
       </p>

       {exercise.image_url && (
         <img
           src={exercise.image_url}
           alt={exercise.title}
           className={styles.exerciseImage}
         />
       )}

       {exercise.video_url &&
       (exercise.video_url.includes("youtube.com") ||
         exercise.video_url.includes("youtu.be")) ? (
         <div className={styles.videoWrapper}>
           <iframe
             src={exercise.video_url}
             width="100%"
             height="100%"
             title="YouTube video player"
             allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowFullScreen
           />
         </div>
       ) : null}

       <p className={styles.exerciseDescription}>{exercise.description}</p>

       <div className={styles.buttonWrapperExercise}>
         <div className={styles.sortGroup}>
           <button onClick={() => onMove("asc", exercise.id)}>
             <ArrowUp size={20} />
           </button>
           <button onClick={() => onMove("desc", exercise.id)}>
             <ArrowDown size={20} />
           </button>
         </div>
         <div className={styles.sortGroup}>
           <button
             className={styles.deleteButton}
             onClick={(e) => onDelete(e, exercise.id)}
             title="Ta bort"
           >
             <Trash2 size={20} />
           </button>
           <button
             className={styles.editButton}
             onClick={() => setIsEditing(true)}
             title="Redigera"
           >
             <Pencil size={18} className={styles.icon} />
           </button>
         </div>
         <button
           className={styles.completeButton}
           onClick={(e) => onComplete(e, exercise)}
         >
           Komplettera
         </button>
       </div>
     </li>
   );
}
