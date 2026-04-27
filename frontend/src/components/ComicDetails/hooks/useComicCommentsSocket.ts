import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { BACKEND_URL } from '@constants';
import { ComicComment, ComicDetailsResponse } from '@types';

import { COMIC_DETAILS_QUERY_KEY } from './useComicDetailsQuery';

type ComicCommentSocketMessage = {
  event: 'comic.comment.created';
  comicId: number;
  comment: ComicComment;
  commentsCount: number;
};

const buildComicCommentsSocketUrl = (comicId: string) => {
  const baseUrl = BACKEND_URL || window.location.origin;
  const socketUrl = new URL(baseUrl);

  socketUrl.protocol = socketUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  socketUrl.pathname = `/ws/comics/${comicId}/comments/`;

  return socketUrl.toString();
};

export const useComicCommentsSocket = (comicId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!comicId || typeof window === 'undefined') {
      return undefined;
    }

    let socket: WebSocket | null = null;
    let reconnectTimeoutId: number | null = null;
    let isUnmounted = false;

    const connect = () => {
      socket = new WebSocket(buildComicCommentsSocketUrl(comicId));

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as ComicCommentSocketMessage;

          if (payload.event !== 'comic.comment.created') {
            return;
          }

          queryClient.setQueryData<ComicDetailsResponse | undefined>([COMIC_DETAILS_QUERY_KEY, comicId], (current) => {
            if (!current) {
              return current;
            }

            const comments = [payload.comment, ...current.comments.filter((item) => item.id !== payload.comment.id)];

            return {
              ...current,
              comments,
              commentsCount: payload.commentsCount,
            };
          });
        } catch {
          queryClient.invalidateQueries([COMIC_DETAILS_QUERY_KEY, comicId]);
        }
      };

      socket.onclose = () => {
        if (isUnmounted) {
          return;
        }

        reconnectTimeoutId = window.setTimeout(connect, 2500);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimeoutId) {
        window.clearTimeout(reconnectTimeoutId);
      }

      socket?.close();
    };
  }, [comicId, queryClient]);
};
