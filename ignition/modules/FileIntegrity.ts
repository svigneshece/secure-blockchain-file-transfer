import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FileIntegrityModule = buildModule("FileIntegrityModule", (m) => {
  const fileIntegrity = m.contract("FileIntegrity");

  return { fileIntegrity };
});

export default FileIntegrityModule;