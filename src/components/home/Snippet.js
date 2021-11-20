import Axios from "axios";
import React, { useState } from "react";
import domain from "../../util/domain";
import "./Snippet.scss";
import { Draggable } from "react-drag-reorder";

function Snippet({
  snippet,
  editSnippet,
  addsubSnippet,
  subSnippets,
  edit,
  anycheckP,
  anycheck,
  getSnippets,
  snippets,
  waiting2,
  keyorder,
  setedit,
}) {
  const [checked, setChecked] = useState(snippet.done);
  const [waiting, setWaiting] = useState(waiting2);
  //const { user } = useContext(UserContext);

  async function deleteSnippet() {
    if (window.confirm("Do you want to delete this snippet?")) {
      await Axios.delete(`${domain}/snippet/${snippet._id}`);
      getSnippets();
    }
  }

  async function handlecheck() {
    if (
      window.confirm(checked ? "עחי? תבטוח שלא סיימת?" : "עחי? תבטוח שסיימת?")
    ) {
      const sending = {
        done: !checked,
      };
      setWaiting(true);
      setedit(false);
      await Axios.put(`${domain}/snippet/check/${snippet._id}`, sending);
      setedit(true);
      setWaiting(false);
      setChecked(!checked);
      getSnippets();
      //anycheckP(anycheck + 5);
    }
  }
  /* 
  useEffect(() => {
    if (!user) setSnippets([]);
    else getSnippets();
  }, [user]); */

  function renderSubSnippets() {
    let sortedsubSnippets = [...subSnippets];
    sortedsubSnippets = sortedsubSnippets.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    function subf(parent) {
      return function (snippet) {
        return snippet.parent && snippet.parent === parent._id;
      };
    }

    return sortedsubSnippets.map((snippet, i) => {
      return (
        <Snippet
          key={i}
          snippet={snippet}
          addsubSnippet={addsubSnippet}
          editSnippet={editSnippet}
          subSnippets={snippets && snippets.filter(subf(snippet))}
          edit={edit}
          setedit={setedit}
          anycheckP={anycheckP}
          anycheck={anycheck}
          getSnippets={getSnippets}
          snippets={snippets}
          waiting2={waiting2}
          keyorder={i}
        />
      );
    });
  }

  const article = document.getElementById("10");

  let a = article && article.id;

  return (
    <div className="snippet">
      {snippet.title && (
        <>
          {edit ? (
            <input
              className="bigcb"
              type="checkbox"
              checked={checked}
              onChange={async () => {
                await handlecheck();
              }}
            />
          ) : (
            <input className="bigcb" type="checkbox" checked={checked} />
          )}
          <h2 className="title">
            {"           " +
              snippet.title +
              ", KEY IS: " +
              keyorder +
              ", AND:" +
              a}
          </h2>{" "}
          {waiting && !edit && (
            <h3 style={{ color: "red", direction: "rtl" }}>
              לא לגעת בכלום אני מעבד את הוי סופית....
            </h3>
          )}
        </>
      )}
      {subSnippets && subSnippets.length > 0 ? (
        <Draggable>{renderSubSnippets()}</Draggable>
      ) : (
        edit && <p className="no-snippets-msg">NO SUB-COMPONENTS YET :(</p>
      )}
      {edit && (
        <>
          <button className="btn-edit" onClick={() => editSnippet(snippet)}>
            Edit
          </button>
          <button
            className="btn-edit"
            style={{ backgroundColor: "#11CC11" }}
            onClick={() => addsubSnippet(snippet)}
          >
            Add Sub
          </button>
          <button className="btn-delete" onClick={deleteSnippet}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default Snippet;
