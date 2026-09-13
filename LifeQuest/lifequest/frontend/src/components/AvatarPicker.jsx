import { AVATARS } from '../utils/avatars';
import { playClick } from '../utils/sounds';

export default function AvatarPicker({ selectedId, onSelect }) {
  return (
    <div className="avatar-selector">
      <div className="avatar-grid">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            className={`avatar-option${avatar.id === selectedId ? ' active' : ''}`}
            role="switch"
            aria-checked={avatar.id === selectedId}
            aria-label={avatar.name}
            title={avatar.name}
            onClick={() => {
              onSelect(avatar.id);
              playClick();
            }}
          >
            <img src={avatar.src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
