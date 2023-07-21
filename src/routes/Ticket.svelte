<script lang="ts">
	import type { InsertTicket } from "$lib/server/schema";
  import githubLogo from "$lib/images/github.svg"
  import dayjs from 'dayjs';
	import type { ShowTicket } from "./proxy+page.server";

  export let ticketData: ShowTicket;
</script>

<div class="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="{githubLogo}" alt="ChitChat Logo">
  </div>
  <div class=" flex-grow">
    <div class="text-xl font-medium text-black">{ticketData.title}</div>
    <p class="text-slate-500">#{ticketData.id}</p>
  </div>
  <div>
    <div class="text-slate-800">Status: {ticketData.status}</div>
    <div class="text-slate-500">Service: {ticketData.fromService}</div>
  </div>
  <div class="text-right">
    <div class="text-slate-700">Open {dayjs().diff(ticketData.createdAt, 'days')}d ago</div>
    <div class="text-slate-700">Last updated {dayjs().diff(ticketData.updatedAt, 'days')}d ago</div>
    <span class="text-slate-700">by {ticketData.createdBy_name}</span>
  </div>
</div>