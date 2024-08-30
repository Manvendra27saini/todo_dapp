"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Profile;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const material_1 = require("@mui/material");
const web3_js_1 = require("@solana/web3.js");
const Header_1 = __importDefault(require("../components/Header"));
const hooks_1 = require("../hooks");
const bytes_1 = require("@project-serum/anchor/dist/cjs/utils/bytes");
function Profile({ match: { params: { address } } }) {
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const { publicKey, sendTransaction } = (0, wallet_adapter_react_1.useWallet)();
    const anchorWallet = (0, wallet_adapter_react_1.useAnchorWallet)();
    const program = (0, hooks_1.useProfileProgram)(connection, anchorWallet);
    const pubkey = (0, react_1.useMemo)(() => {
        return address ? new web3_js_1.PublicKey(address) : publicKey;
    }, [
        address, publicKey
    ]);
    const isMe = (0, react_1.useMemo)(() => {
        return (pubkey === null || pubkey === void 0 ? void 0 : pubkey.toString()) === (publicKey === null || publicKey === void 0 ? void 0 : publicKey.toString());
    }, [
        pubkey, publicKey
    ]);
    const [name, setName] = (0, react_1.useState)("");
    const [location, setLocation] = (0, react_1.useState)("");
    const [likes, setLikes] = (0, react_1.useState)(0);
    const [exists, setExists] = (0, react_1.useState)(false);
    const [liked, setLiked] = (0, react_1.useState)(false);
    const [profilePda, setProfilePda] = (0, react_1.useState)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const findProfilePda = () => __awaiter(this, void 0, void 0, function* () {
            if (pubkey && program) {
                const [profilePda, profileBump] = yield web3_js_1.PublicKey.findProgramAddress([
                    bytes_1.utf8.encode('PROFILE_STATE'), pubkey.toBuffer()
                ], program === null || program === void 0 ? void 0 : program.programId);
                setProfilePda(profilePda);
            }
        });
        findProfilePda();
    }, [
        pubkey, program
    ]);
    (0, react_1.useEffect)(() => {
        const findProfileAccount = () => __awaiter(this, void 0, void 0, function* () {
            if (profilePda && program && !loading) {
                const account = yield program.account.userProfile.fetchNullable(profilePda);
                if (account) {
                    setExists(true);
                    setName(account.name);
                    setLocation(account.location);
                    setLikes(account.likes);
                    if (!isMe && publicKey && pubkey) {
                        const [likePda, likeBump] = yield web3_js_1.PublicKey.findProgramAddress([
                            bytes_1.utf8.encode('LIKE_STATE'), publicKey.toBuffer(), pubkey.toBuffer(),
                        ], program.programId);
                        const likeAccount = yield program.account.userLike.fetchNullable(likePda);
                        if (likeAccount) {
                            setLiked(likeAccount.liked);
                        }
                        else {
                            setLiked(false);
                        }
                    }
                }
                else {
                    setExists(false);
                }
            }
        });
        findProfileAccount();
    }, [
        profilePda, loading
    ]);
    const handleInput = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        }
        if (name === 'location') {
            setLocation(value);
        }
    };
    const handleCreate = () => __awaiter(this, void 0, void 0, function* () {
        if (program && publicKey) {
            setLoading(true);
            try {
                yield program.methods.createProfile(name, location)
                    .accounts({
                    userProfile: profilePda,
                    authority: publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId
                })
                    .rpc();
            }
            catch (_a) {
                //
            }
            setLoading(false);
        }
    });
    const handleUpdate = () => __awaiter(this, void 0, void 0, function* () {
        if (program && publicKey) {
            setLoading(true);
            try {
                yield program.methods.updateProfile(name, location)
                    .accounts({
                    userProfile: profilePda,
                    authority: publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId
                })
                    .rpc();
            }
            catch (_a) {
                //
            }
            setLoading(false);
        }
    });
    const handleLike = () => __awaiter(this, void 0, void 0, function* () {
        if (program && publicKey && pubkey) {
            setLoading(true);
            try {
                const [likePda, likeBump] = yield web3_js_1.PublicKey.findProgramAddress([
                    bytes_1.utf8.encode('LIKE_STATE'), publicKey.toBuffer(), pubkey.toBuffer(),
                ], program === null || program === void 0 ? void 0 : program.programId);
                yield program.methods.likeProfile(pubkey)
                    .accounts({
                    userLike: likePda,
                    userProfile: profilePda,
                    authority: publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId
                })
                    .rpc();
            }
            catch (_a) {
                //
            }
            setLoading(false);
        }
    });
    const handleUnlike = () => __awaiter(this, void 0, void 0, function* () {
        if (program && publicKey && pubkey) {
            setLoading(true);
            try {
                const [likePda, likeBump] = yield web3_js_1.PublicKey.findProgramAddress([
                    bytes_1.utf8.encode('LIKE_STATE'), publicKey.toBuffer(), pubkey.toBuffer(),
                ], program === null || program === void 0 ? void 0 : program.programId);
                yield program.methods.unlikeProfile(pubkey)
                    .accounts({
                    userLike: likePda,
                    userProfile: profilePda,
                    authority: publicKey,
                    systemProgram: web3_js_1.SystemProgram.programId
                })
                    .rpc();
            }
            catch (_a) {
                //
            }
            setLoading(false);
        }
    });
    return (<material_1.Container maxWidth="lg">

            <Header_1.default />

            <material_1.Box flexDirection='column' justifyContent='center' display='flex' height='600px' gap='24px'>

                <h1>
                    User Profile
                </h1>

                <material_1.TextField label="Name" name="name" value={name} onChange={handleInput} variant="standard"/>

                <material_1.TextField label="Location" name="location" value={location} onChange={handleInput} variant="standard"/>

                <material_1.TextField label="Likes" name="likes" value={likes} variant="standard" disabled={true}/>

                <material_1.Box>
                    {isMe ?
            (exists ?
                <material_1.Button variant='contained' onClick={handleUpdate} disabled={loading}>Update Profile</material_1.Button>
                : <material_1.Button variant='contained' onClick={handleCreate} disabled={loading}>Create Profile</material_1.Button>) : (liked ?
            <material_1.Button variant='contained' onClick={handleUnlike} disabled={loading}>Unlike Profile</material_1.Button>
            : <material_1.Button variant='contained' onClick={handleLike} disabled={loading}>Like Profile</material_1.Button>)}
                </material_1.Box>

            </material_1.Box>

        </material_1.Container>);
}
;
