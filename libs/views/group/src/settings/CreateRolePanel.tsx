import { Button, FormControl, HStack, Input } from '@chakra-ui/react';
import { Snowflake } from '@omagize/api';
import { useCreateRoleMutation } from '@omagize/data-access-api';
import { useState } from 'react';

export function CreateRolePanel({ group }: { group: Snowflake }) {
  const [name, setName] = useState('');
  const mutation = useCreateRoleMutation();

  return (
    <FormControl>
      <HStack>
        <Input
          w="full"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="focus"
          placeholder="Role name..."
        />
        <Button
          variant="brand"
          isLoading={mutation.isLoading}
          onClick={() =>
            mutation.mutate({
              group,
              name,
            })
          }
          disabled={mutation.isLoading || name.trim().length === 0}
        >
          Create
        </Button>
      </HStack>
    </FormControl>
  );
}
