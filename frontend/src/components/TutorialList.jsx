import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import EditTutorial from "./EditTutorial";
import { useState } from "react";

const TutorialList = ({ tutor, getTutorials }) => {
  const [editItem, setEditItem] = useState("");

  //! DELETE (CRUD-Delete)
  const deleteTutorial = async (id) => {
    const url = "http://127.0.0.1:8000/tutorials";
    try {
      await axios.delete(`${url}/${id}/`);
    } catch (error) {
      console.log(error);
    }
    getTutorials();
  };

  // //! PUT (CRUD-Update)
  // //! PUT: Whole Update, PATCH: Partially Update
  // const editTutorial = async ({ id, title, description }) => {
  //   // const { id, title, description } = item;
  //   const url = "https://tutorials-api-cw.herokuapp.com/api/tutorials";
  //   try {
  //     await axios.put(`${url}/${id}`, { title, description });
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   getTutorials();
  // };

  return (
    <div className="container mt-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#id</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col" className="text-center">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {tutor?.map((item) => {
            const { id, title, description } = item;
            return (
              <tr key={id}>
                <th>{id}</th>
                <td>{title}</td>
                <td>{description}</td>
                <td className="text-center text-nowrap">
                  <FaEdit
                    size={20}
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#edit-modal"
                    className="me-2 text-warning"
                    // onClick={() =>
                    //   editTutorial({
                    //     id: "1581",
                    //     title: "UPDATE",
                    //     description: "UPDATE",
                    //   })
                    // }
                    onClick={() => setEditItem(item)}
                  />
                  <AiFillDelete
                    size={22}
                    type="button"
                    className="text-danger "
                    onClick={() => deleteTutorial(id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <EditTutorial editItem={editItem} getTutorials={getTutorials} />
    </div>
  );
};

export default TutorialList;
