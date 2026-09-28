import { Icon } from "@/components/ui/Icon";

// Boutons de soumission partagés par les formulaires de modération (champ `status`).
export function ModerationButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="submit" name="status" value="APPROVED" className="btn btn-primary btn-sm">
        <Icon name="check" className="size-4" />
        Approuver
      </button>
      <button type="submit" name="status" value="REJECTED" className="btn btn-danger btn-sm">
        <Icon name="x" className="size-4" />
        Rejeter
      </button>
    </div>
  );
}
