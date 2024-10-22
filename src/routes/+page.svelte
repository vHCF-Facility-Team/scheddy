<script lang="ts">
	import {
		PUBLIC_FACILITY_NAME,
		PUBLIC_VATSIM_OAUTH_BASE,
		PUBLIC_VATSIM_OAUTH_CLIENT_ID,
		PUBLIC_VATSIM_OAUTH_REDIRECT_URL
	} from '$env/static/public';
	import Button from '$lib/ui/Button.svelte';
	import Card from '$lib/ui/Card.svelte';
	import { version } from '$app/environment';
	import { HeartIcon } from "lucide-svelte";
</script>

<Card>
	<p class="font-bold text-red-500">Internal Development Release - DO NOT SHARE</p>
	<h1 class="font-bold text-2xl text-center">{PUBLIC_FACILITY_NAME} - Scheddy</h1>

	<Button href="{PUBLIC_VATSIM_OAUTH_BASE}/oauth/authorize?response_type=code&client_id={PUBLIC_VATSIM_OAUTH_CLIENT_ID}&redirect_uri={PUBLIC_VATSIM_OAUTH_REDIRECT_URL}">
		Login with VATSIM
	</Button>

	<a target="_blank" href="https://github.com/ZTL-ARTCC/scheddy" class="block hover:underline text-sm text-slate-500">scheddy v{version} - built with <HeartIcon class="inline w-5 h-5 align-top" /> by the ZTL ARTCC</a>
</Card>