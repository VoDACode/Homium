import React from "react";
import cl from "./.module.css";
import { ApiExtensions } from "../../services/api/extensions";
import Space from "../../components/Space/Space";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";
import CustomTextarea from "../../components/CustomTextarea/CustomTextarea";

type ExtensionData = {
    id: string,
    name: string,
    author: string,
    version: string,
    description?: string,
    url?: string,
    authorUrl?: string
}

enum ExtensionFilter {
    Browse = 0,
    Installed = 1,
    Updates = 2
}

const ExtensionListPage = () => {

    const [isLoading, setLoadingState] = React.useState<boolean>(false);
    const [extensions, setExtensions] = React.useState<Array<ExtensionData>>([]);
    const [extensionFilter, setExtensionFilter] = React.useState<ExtensionFilter>(ExtensionFilter.Browse);
    const [search, setSearch] = React.useState('');

    async function UpdateExtensions() {
        setLoadingState(true);

        await ApiExtensions.getExtensions().then(data => {
            setExtensions(data);
        });

        setLoadingState(false);
    }

    function RenderExtensions() {
        if (isLoading) {
            return (
                <div>
                    <Space height="20px" />
                    <LoadingAnimation size="70px" loadingCurveWidth="11px" isCenter={true} />
                </div>
            );
        }

        var result: Array<React.ReactNode> = [];
        var sortedExtensions: Array<ExtensionData> = [...extensions];

        sortedExtensions.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
            }
            return 0;
        });

        sortedExtensions.map((extension) => {
            if (search !== '' &&
                !extension.name.toLowerCase().includes(search.toLowerCase()) &&
                !extension.author.toLowerCase().includes(search.toLowerCase()) &&
                !extension.description?.toLowerCase().includes(search.toLowerCase())) {
                return;
            }

            result.push(
                <div key={extension.id}>
                    <Space height="20px" />
                    <div className={cl.extension_record}>
                        <div className={cl.extension_info_part}>
                            <div className={cl.extension_main_info_cont}>
                                <img className={cl.extension_img} alt="" />
                                <div className={cl.extension_name_and_author_cont}>
                                    <h2
                                        className={`${cl.extension_name} ${extension.url ? cl.active_text_link : ''}`}
                                        onClick={() => {
                                            if (extension.url) {
                                                window.location.href = (extension.url ?? "");
                                            }
                                        }}>{extension.name}</h2>
                                    <p
                                        className={`${cl.extension_author} ${extension.authorUrl ? cl.active_text_link : ''}`}
                                        onClick={() => {
                                            if (extension.authorUrl) {
                                                window.location.href = (extension.authorUrl ?? "");
                                            }
                                        }}>by <b>{extension.author}</b></p>
                                </div>
                            </div>
                            <div className={cl.extension_description_cont}>
                                <p className={cl.extension_description}>{extension.description}</p>
                            </div>
                            <div className={cl.tag_cont}>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                                <div className={cl.tag}><span>logs</span></div>
                            </div>
                            <div className={cl.stat_cont}>
                                <div className={cl.installed_count_cont}>
                                    <span className={cl.installed_count_text}>659.4k</span>
                                    <img className={cl.installed_count_img} />
                                </div>
                                <div className={cl.last_update_cont}>
                                    <span className={cl.last_update_text}>Last update 2 days ago</span>
                                </div>
                            </div>
                        </div>
                        <div className={cl.extension_version_control_part}>
                            <div className={cl.extension_version_cont}>
                                <p className={cl.extension_current_version}>{extension.version}</p>
                                <p className={cl.extension_new_version}>1.0.1</p>
                            </div>
                            <div className={cl.extension_actions}>
                                <div className={cl.extension_install_button_cont}>
                                    <div className={cl.extension_install_button}>
                                        <span className={cl.extension_install_button_text}>Install</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        return result;
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = 'whitesmoke';
        UpdateExtensions();
    }, []);

    return (
        <div>
            <Space height="20px" />
            <div className={cl.list_control_panel}>
                <CustomTextarea font="robotic" placeholder="Search" contentSize="28px" height="33px" width="500px" onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSearch(e.target.value)} />
            </div>
            <Space height="20px" />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ width: '100%', paddingInline: '10px' }}>
                    <div className={cl.search_type_panel}>
                        <div className={`${cl.search_type_option_cont} ${cl.search_type_option_cont_browse}`}>
                            <div className={`${cl.search_type_option} ${cl.search_type_option_browse} ${extensionFilter === ExtensionFilter.Browse ? cl.search_type_option_current : ''}`} onClick={() => setExtensionFilter(ExtensionFilter.Browse)}>
                                <p className={`${cl.search_type_option_text} ${cl.search_type_option_text_browse}`}>Browse</p>
                            </div>
                        </div>
                        <div className={`${cl.search_type_option_cont} ${cl.search_type_option_cont_installed}`}>
                            <div className={`${cl.search_type_option} ${cl.search_type_option_installed} ${extensionFilter === ExtensionFilter.Installed ? cl.search_type_option_current : ''}`} onClick={() => setExtensionFilter(ExtensionFilter.Installed)}>
                                <p className={`${cl.search_type_option_text} ${cl.search_type_option_text_installed}`}>Installed</p>
                            </div>
                        </div>
                        <div className={`${cl.search_type_option_cont} ${cl.search_type_option_cont_updates}`}>
                            <div className={`${cl.search_type_option} ${cl.search_type_option_updates} ${extensionFilter === ExtensionFilter.Updates ? cl.search_type_option_current : ''}`} onClick={() => setExtensionFilter(ExtensionFilter.Updates)}>
                                <p className={`${cl.search_type_option_text} ${cl.search_type_option_text_updates}`}>Updates</p>
                            </div>
                        </div>
                    </div>
                    {RenderExtensions()}
                    <Space height="20px" />
                </div>
            </div>
        </div>
    );
}

export default ExtensionListPage;