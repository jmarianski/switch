import { cls } from "../util";
const Icon = ({ item, onClick, onDelete }) => {
  const { id, icon, name } = item;
  const onSelect = (e) => {
    onClick(item);
  };
  const onClickDelete = () => {
    onDelete(item);
  };
  return (
    <div className="icon-container">
      <button
        className={cls({
          icon: true,
          selected: !!item?.focused,
          notification: !!item?.notification,
        })}
        data-id={id}
        onClick={onSelect}
        style={{
          backgroundImage: `url(${icon})`,
        }}
      />
      <button data-id={item.id} className="delete" onClick={onClickDelete}>
        x
      </button>
    </div>
  );
};

function Sidebar({
  environments,
  onAddEnvironment,
  onAddApplication,
  onSelectEnvironment,
  onSelectApplication,
  onRemoveEnvironment,
  onRemoveApplication,
}) {
  return (
    <div className="sidebar">
      {environments.map((env, i) => {
        return (
          <div className="environment" key={i}>
            <Icon
              item={env}
              onClick={onSelectEnvironment}
              onDelete={onRemoveEnvironment}
            />
            {env.applications.map((app, j) => {
              return (
                <div className="application" key={j}>
                  <Icon
                    item={app}
                    onClick={onSelectApplication}
                    onDelete={onRemoveApplication}
                  />
                </div>
              );
            })}
            <button className="icon" onClick={() => onAddApplication(env)}>
              +
            </button>
          </div>
        );
      })}
      <div>
        <button className="icon" onClick={onAddEnvironment}>
          +
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
