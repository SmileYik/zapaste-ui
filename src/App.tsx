import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { fetchPublicPastes } from "./api"
import { useState } from "react";
import PasteSummary from "./entity/paste_summary";
import PaginationList from "./components/pagination-list";
import type PaginationListHandler from "./components/pagination-list/PaginationListHandler";
import PasteSummaryPageHandler from "./components/paste-summary-page/PasteSummaryPage";
import { MdElevation } from "./components/Material";
import HeadTabLine from "./components/HeadTabLine/HeadTabLine";

const queryClient = new QueryClient()

function App() {

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <p>Hello Zapaste</p>
        <HeadTabLine></HeadTabLine>
        <Example></Example>
        <Example></Example>
      </QueryClientProvider>
    </>
  )
}

function Example() {
  return (
    <>
      <PaginationList requestFn={fetchPublicPastes} handler={new PasteSummaryPageHandler()}></PaginationList>
    </>
  )
}

export default App
