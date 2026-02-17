import { fetcher } from "@/api/fetcher";
import type { Feedback } from "@/entities/Feedback";
import { useQuery } from "@tanstack/react-query";

export const useGetAllFeedback = () => {
  const url = "/api/feedbacks";

  const query = useQuery<
    Feedback[],
    Error,
    {
      id: number;
      sender_type: string;
      sender_id: number;
      sender_name: string;
      content: string;
      created_at: string;
    }[]
  >({
    queryKey: ["feedbacks"],
    queryFn: () => fetcher<Feedback[]>(url),
    select: (response) => {
      const feedbacks = Array.isArray(response) ? response : (response ?? []);

      return feedbacks.map((feedback) => ({
        id: feedback.id,
        sender_type: feedback.sender_type,
        sender_id: feedback.sender_id,
        sender_name: feedback.sender_name,
        content: feedback.content,
        created_at: feedback.created_at,
      }));
    },
  });

  return query;
};
