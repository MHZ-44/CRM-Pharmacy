import { fetcher } from "@/api/fetcher";
import type { Feedback } from "@/entities/Feedback";
import { useQuery } from "@tanstack/react-query";

export const useGetOneFeedback = (id: number | null | undefined) => {
  const query = useQuery<
    Feedback,
    Error,
    {
      id: number;
      sender_type: string;
      sender_id: number;
      sender_name: string;
      content: string;
      created_at: string;
    } | null
  >({
    queryKey: ["feedbacks", id],
    queryFn: () => fetcher<Feedback>(`/api/feedbacks/${id}`),
    enabled: Boolean(id),
    select: (response) => {
      const feedback = Array.isArray(response) ? response[0] : response;

      if (!feedback) return null;

      return {
        id: feedback.id,
        sender_type: feedback.sender_type,
        sender_id: feedback.sender_id,
        sender_name: feedback.sender_name,
        content: feedback.content,
        created_at: feedback.created_at,
      };
    },
  });

  return query;
};
