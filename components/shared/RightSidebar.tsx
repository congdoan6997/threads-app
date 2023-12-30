import React from "react";

const RightSidebar = () => {
  return (
    <section className="rightsidebar custom-scrollbar">
      <div className="flex flex-col flex-1 justify-start">
        <h3 className="text-heading3 text-light-1">Suggested Communities</h3>
      </div>

      <div className="flex flex-col flex-1 justify-start">
        <h3 className="text-heading3 text-light-1">Suggested Users</h3>
      </div>
    </section>
  );
};

export default RightSidebar;
