import { useState } from "react";

const List = ({ items, addFunction, selectFunction, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const onSelect = (e) => {
    const item = items.find((i) => i.id === e.target.getAttribute("data-id"));
    if (item) {
      setSelectedItem(item);
      selectFunction(item);
    }
  };

  const onClickDelete = (e) => {
    const item = items.find((i) => i.id === e.target.getAttribute("data-id"));
    if (item) {
      onDelete(item);
    }
  };

  return (
    <>
      {items &&
        items.map((item) => {
          return (
            <div className="icon-container">
              <button
                className={
                  "icon" + (selectedItem?.id === item.id ? " selected" : "")
                }
                data-id={item.id}
                onClick={onSelect}
                style={{
                  backgroundImage: `url(${item.icon})`,
                }}
              />
              <span class="label">{item.name}</span>
              <button
                data-id={item.id}
                className="delete"
                onClick={onClickDelete}
              >
                x
              </button>
            </div>
          );
        })}
      <button className="icon" onClick={addFunction}>
        +
      </button>
    </>
  );
};

function Sidebar({
  environments,
  selectedEnvironment,
  onAddEnvironment,
  onAddApplication,
  onSelectEnvironment,
  onSelectApplication,
  onRemoveEnvironment,
  onRemoveApplication,
}) {
  const onAddApplicationForCurrentEnvironment = () => {
    onAddApplication();
  };
  return (
    <div className="sidebar">
      <div className="environments">
        <List
          items={environments}
          addFunction={onAddEnvironment}
          selectFunction={onSelectEnvironment}
          onDelete={onRemoveEnvironment}
        />
      </div>
      <div className="applications">
        {selectedEnvironment && (
          <List
            items={selectedEnvironment?.applications}
            addFunction={onAddApplicationForCurrentEnvironment}
            selectFunction={onSelectApplication}
            onDelete={onRemoveApplication}
          />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
