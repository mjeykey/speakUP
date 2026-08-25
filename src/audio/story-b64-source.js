const sourceCache=new Map();

export function getBase64AudioSource(partUrls,mime='audio/mpeg'){
  const urls=(partUrls||[]).map(String);
  const key=`${mime}|${urls.join('|')}`;
  if(sourceCache.has(key))return sourceCache.get(key);

  const promise=(async()=>{
    const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'force-cache'})));
    const failed=responses.find(response=>!response.ok);
    if(failed)throw new Error(`HTTP ${failed.status}`);
    const encoded=(await Promise.all(responses.map(response=>response.text())))
      .join('')
      .replace(/\s+/g,'');
    const binary=atob(encoded);
    const bytes=new Uint8Array(binary.length);
    for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
    return URL.createObjectURL(new Blob([bytes],{type:mime}));
  })().catch(error=>{
    sourceCache.delete(key);
    throw error;
  });

  sourceCache.set(key,promise);
  return promise;
}
