const fs = require("fs");
const path = "./android/app/build.gradle";
const stringsXmlPath = "./android/app/src/main/res/values/strings.xml";
const appJsonPath = "./app.json";
const iosInfoPlistPath = "./ios/wallet/Info.plist";

// Obtener la versión como parámetro (opcional)
const newVersionName = process.argv[2];

let buildGradle = fs.readFileSync(path, "utf8");

// Buscar versionCode y versionName
const versionCodeMatch = buildGradle.match(/versionCode\s+(\d+)/);
const versionNameMatch = buildGradle.match(/versionName\s+"(.+)"/);

if (!versionCodeMatch || !versionNameMatch) {
  console.error(
    "❌ No se encontraron versionCode o versionName en build.gradle"
  );
  process.exit(1);
}

const currentVersionCode = parseInt(versionCodeMatch[1]);
const newVersionCode = currentVersionCode + 1;

// Si no se pasa versión como parámetro, generar automáticamente
let finalVersionName;
if (newVersionName) {
  finalVersionName = newVersionName;
  console.log(`📝 Usando versión especificada: ${finalVersionName}`);
} else {
  // Extraer el número actual del versionName para incrementarlo
  const currentVersion = versionNameMatch[1];
  const versionMatch = currentVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);

  if (versionMatch) {
    const major = parseInt(versionMatch[1]);
    const minor = parseInt(versionMatch[2]);
    const patch = parseInt(versionMatch[3]);
    finalVersionName = `${major}.${minor}.${patch + 1}`;
  } else {
    // Si no coincide el patrón, usar el versionCode
    finalVersionName = `1.0.${newVersionCode}`;
  }
  console.log(`📝 Generando versión automática: ${finalVersionName}`);
}

// Actualizar build.gradle
buildGradle = buildGradle
  .replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`)
  .replace(/versionName\s+".*?"/, `versionName "${finalVersionName}"`);

fs.writeFileSync(path, buildGradle);

// Actualizar strings.xml
let stringsXml = fs.readFileSync(stringsXmlPath, "utf8");
stringsXml = stringsXml.replace(
  /<string name="expo_runtime_version">.*?<\/string>/,
  `<string name="expo_runtime_version">${finalVersionName}</string>`
);
fs.writeFileSync(stringsXmlPath, stringsXml);

// Actualizar app.json
let appJson = fs.readFileSync(appJsonPath, "utf8");
appJson = appJson.replace(
  /"runtimeVersion":\s*"[^"]*"/,
  `"runtimeVersion": "${finalVersionName}"`
);
fs.writeFileSync(appJsonPath, appJson);

// Actualizar iOS Info.plist
let infoPlist = fs.readFileSync(iosInfoPlistPath, "utf8");

// Buscar CFBundleShortVersionString y CFBundleVersion
const shortVersionMatch = infoPlist.match(
  /<key>CFBundleShortVersionString<\/key>\s*<string>(.+?)<\/string>/
);
const bundleVersionMatch = infoPlist.match(
  /<key>CFBundleVersion<\/key>\s*<string>(\d+)<\/string>/
);

if (shortVersionMatch && bundleVersionMatch) {
  const currentBundleVersion = parseInt(bundleVersionMatch[1]);
  const newBundleVersion = currentBundleVersion + 1;

  // Actualizar CFBundleShortVersionString (version visible al usuario)
  infoPlist = infoPlist.replace(
    /<key>CFBundleShortVersionString<\/key>\s*<string>.+?<\/string>/,
    `<key>CFBundleShortVersionString</key>\n\t<string>${finalVersionName}</string>`
  );

  // Actualizar CFBundleVersion (build number)
  infoPlist = infoPlist.replace(
    /<key>CFBundleVersion<\/key>\s*<string>\d+<\/string>/,
    `<key>CFBundleVersion</key>\n\t<string>${newBundleVersion}</string>`
  );

  fs.writeFileSync(iosInfoPlistPath, infoPlist);
  console.log(
    `✅ Actualizado iOS Info.plist: CFBundleShortVersionString "${finalVersionName}", CFBundleVersion ${newBundleVersion}`
  );
} else {
  console.log(
    "⚠️  No se encontraron las claves de versión en Info.plist de iOS"
  );
}

console.log(
  `✅ Actualizado a versionCode ${newVersionCode}, versionName "${finalVersionName}"`
);
console.log(`✅ Actualizado expo_runtime_version en strings.xml`);
console.log(`✅ Actualizado runtimeVersion en app.json`);
