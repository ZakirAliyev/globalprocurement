import { useState, useEffect } from 'react';
import { Button, Flex, Table } from 'antd';
import { useGetUsersQuery } from '../../../services/adminApi.jsx';
import { useNavigate } from 'react-router-dom';
import { TbPencil } from 'react-icons/tb';

const columns = [
    {
        title: 'ID',
        dataIndex: 'index',
        key: 'index',
        width: '5%',
    },
    {
        title: 'Ad',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Soyad',
        dataIndex: 'surname',
        key: 'surname',
    },
    {
        title: 'Şirkət',
        dataIndex: 'companyName',
        key: 'companyName',
        render: (text) => text || '-',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Telefon',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
            <Button type="link">
                <TbPencil fontSize={'large'} />
            </Button>
        ),
    },
];

const UsersTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { data: getUsers, isLoading, refetch } = useGetUsersQuery();

    // Refetch data when the component mounts
    useEffect(() => {
        refetch();
    }, [refetch]);

    const users = getUsers?.data || [];

    // Transform user data to include index and key
    const dataSource = users.map((user, index) => ({
        key: user.id,
        index: index + 1,
        id: user.id,
        name: user.name,
        surname: user.surname,
        companyName: user.companyName,
        email: user.email,
        phoneNumber: user.phoneNumber,
    }));

    const start = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Flex gap="middle" vertical>
            <Flex
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                    }}
                >
                    <Button
                        type="primary"
                        onClick={start}
                        disabled={!hasSelected}
                        loading={loading}
                    >
                        Sil
                    </Button>
                    {hasSelected ? `${selectedRowKeys.length} element seçilib` : null}
                </div>
            </Flex>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    pageSize: 8,
                }}
                loading={isLoading}
            />
        </Flex>
    );
};

export default UsersTable;