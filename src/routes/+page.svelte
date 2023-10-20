<script>
	import CodeMirror from '$lib/components/CodeMirror.svelte';
</script>

<main>
	<div class="toolbar">
		<div>
			<label />
		</div>
	</div>

	<div class="grid place-items-center grow w-full">
		<div class="frame">
			<div class="code-window">
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
	</div>
</main>

<style lang="scss">
	@mixin with-border-gradient {
		@include border-gradient;
		--p-border-radius: 1.25rem;
		--p-border-gradient-before: linear-gradient(
			to bottom,
			hsl(var(--color-white-hsl) / 0.12) 0%,
			hsl(var(--color-white-hsl) / 0) 100%
		);
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		height: 100vh;

		padding: 1rem;
		margin-inline: auto;
		max-width: 1440px;
	}

	.toolbar {
		@include with-border-gradient;
		padding: 1rem;
		width: 100%;
		background-color: var(--color-card);
	}

	.frame {
		background: url('/images/bg-1.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		aspect-ratio: 1200 / 675;
		width: 100%;

		padding: 1rem;
		align-self: center;

		display: grid;
		place-items: center;

		.code-window {
			@include with-border-gradient;
			min-width: 500px;

			padding: 0.5rem;
			padding-block-start: 1rem;
			background-color: var(--color-greyscale-850);

			.editor {
				border-radius: 1rem;
				background: linear-gradient(112deg, rgba(0, 0, 0, 0.48) 26.01%, rgba(0, 0, 0, 0.06) 94.72%);
				min-height: 100px;
				overflow: hidden;
				padding: 2rem;
			}
		}
	}
</style>
