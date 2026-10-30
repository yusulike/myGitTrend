import { buildGlobalSearchIndex } from './collector';

async function main() {
  console.log('Building global search index from archives...');
  await buildGlobalSearchIndex();
  console.log('Done!');
}

main().catch((err) => {
  console.error('Failed to build search index:', err);
  process.exit(1);
});
