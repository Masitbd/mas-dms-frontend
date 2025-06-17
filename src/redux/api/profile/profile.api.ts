import { baseApi } from "../baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileList: build.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["single-profile"],
    }),
  }),
});

export const { useGetProfileListQuery } = profileApi;
