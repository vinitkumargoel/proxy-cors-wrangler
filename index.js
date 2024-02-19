addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

const corsHeaders = {
  'Access-Control-Allow-Headers': '*', // What headers are allowed. * is wildcard. Instead of using '*', you can specify a list of specific headers that are allowed, such as: Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept, Authorization.
  'Access-Control-Allow-Methods': '*', // Allowed methods. Others could be GET, PUT, DELETE etc.
  'Access-Control-Allow-Origin': '*', // This is URLs that are allowed to access the server. * is the wildcard character meaning any URL can.,
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return new Response("OK", {
      headers: corsHeaders
    });
  } else if (request.method === 'POST') {
    return fetchAndStream(request);
  } else if (request.method === 'GET') {
    return fetchAndStream(request);
  } else {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders
    });
  }
}

async function fetchAndStream(request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  if (!params.has("url")) {
      return new Response("400 Bad Request", {status: 400});
  }

  const response = await fetch(decodeURIComponent(params.get("url")), {
      headers: request.headers,
      redirect: "follow"
  });

  const {readable, writable} = new TransformStream();
  response.body.pipeTo(writable);

  const newResponse = new Response(readable, response);
  newResponse.headers.append("Access-Control-Allow-Origin", "*");
  // newResponse.headers.append("Access-Control-Allow-Origin", "https://www.vinitkumar.dev");
  newResponse.headers.append("Access-Control-Allow-Headers", "*");
  newResponse.headers.append("Access-Control-Allow-Methods", "*");

  return newResponse;
}