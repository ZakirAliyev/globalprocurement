import { useEffect } from 'react';
import { Flex, Table } from 'antd';
import { useGetUsersQuery } from '../../../services/adminApi.jsx';

const columns = [
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
    }
];

const UsersTable = () => {
    const { data: getUsers, isLoading, refetch } = useGetUsersQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const users = getUsers?.data || [];

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

    return (
        <Flex gap="middle" vertical>
            <Table columns={columns}
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