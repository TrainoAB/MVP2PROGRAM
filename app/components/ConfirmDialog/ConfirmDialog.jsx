import styles from "./ConfirmDialog.module.css";

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  message = "Är du säker?",
}) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirm} onClick={onConfirm}>
            Ja
          </button>
          <button className={styles.cancel} onClick={onCancel}>
            Avbryt
          </button>
        </div>
      </div>
    </div>
  );
}
