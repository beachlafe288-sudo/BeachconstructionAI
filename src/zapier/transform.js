// transform.js
// Convert a Zapier webhook payload into a HubSpot contact create payload.

function mapToHubSpot(zapier) {
  // This is a minimal example. Adapt field mappings to your Zap payload and HubSpot schema.
  // HubSpot expects an object: { properties: { email: '...', firstname: '...', ... } }
  const email = zapier?.email || zapier?.data?.email || zapier?.payload?.email;
  const firstName = zapier?.first_name || zapier?.data?.first_name || zapier?.payload?.firstName;
  const lastName = zapier?.last_name || zapier?.data?.last_name || zapier?.payload?.lastName;
  const phone = zapier?.phone || zapier?.data?.phone;
  const company = zapier?.company || zapier?.data?.company;

  const properties = {};
  if (email) properties.email = email;
  if (firstName) properties.firstname = firstName;
  if (lastName) properties.lastname = lastName;
  if (phone) properties.phone = phone;
  if (company) properties.company = company;

  // Add any additional mapping logic here.
  return { properties };
}

module.exports = { mapToHubSpot };
