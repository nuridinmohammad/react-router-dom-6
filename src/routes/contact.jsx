import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact;
}

export default function Contact() {
  const contacts = useLoaderData();

  return (
    <div id="contact">
      <div>
        <img key={contacts.avatar} src={contacts.avatar || null} />
      </div>

      <div>
        <h1>
          {contacts.first || contacts.last ? (
            <>
              {contacts.first} {contacts.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contacts={contacts} />
        </h1>

        {contacts.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contacts.twitter}`}>
              {contacts.twitter}
            </a>
          </p>
        )}

        {contacts.notes && <p>{contacts.notes}</p>}

        <div>
          <Form action="update">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}>
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contacts }) {
  // yes, this is a `let` for later
  const fetcher = useFetcher();
  let favorite = contacts.favorite;

  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}>
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
