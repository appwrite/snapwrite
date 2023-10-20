<script>
	import CodeMirror from '$lib/components/CodeMirror.svelte';
</script>

<main>
	<div class="border bc-subtle border-solid shadow rounded-xl p-16" />

	<div class="frame">
		<div class="code-window p-8 pbs-16 bg-greyscale-850">
			<div class="flex gap-8 mis-8">
				<div class="square-12 bg-#EC6A5E rounded-full" />
				<div class="square-12 bg-#F5BF4F rounded-full" />
				<div class="square-12 bg-#61C554 rounded-full" />
			</div>
			<div class="editor mbs-16">
				<CodeMirror
					value={`import { Client, Account } from "appwrite";
const client = new Client()
	.setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
	.setProject('<PROJECT_ID>');                 // Your project ID

const account = new Account(client);

const user = await account.create('[USER_ID]', 
'email@example.com', 'password');`}
				/>
			</div>
		</div>
	</div>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-columns: max(30%, 320px) 1fr;
		gap: 1rem;
		height: 100vh;

		padding: 1rem;
		margin-inline: auto;
		max-width: 1440px;
	}

	.frame {
		background: url('/images/bg-1.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		aspect-ratio: 1200 / 675;

		padding: 1rem;
		align-self: center;

		display: grid;
		place-items: center;
	}

	.code-window {
		@include border-gradient;
		--p-border-radius: 1.25rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			hsl(var(--color-white-hsl) / 0.12) 0%,
			hsl(var(--color-white-hsl) / 0) 100%
		);

		min-width: 500px;
	}

	.editor {
		border-radius: 1rem;
		background: linear-gradient(112deg, rgba(0, 0, 0, 0.48) 26.01%, rgba(0, 0, 0, 0.06) 94.72%);
		min-height: 300px;
		overflow: hidden;
		padding: 2rem;
	}
</style>
