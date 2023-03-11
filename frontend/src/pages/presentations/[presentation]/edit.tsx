import Editor from "../../../components/editPage";
import { useRouter } from "next/router";

export default function EditPresentation() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Editor presentationId={id} />
    )
}


