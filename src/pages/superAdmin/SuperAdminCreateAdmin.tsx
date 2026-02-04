import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCATIONS } from "@/lib/locations";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function SuperAdminCreateAdmin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-full w-full bg-muted/30">
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">Create Admin</h1>

        <Card className="w-full">
          <CardContent className="px-8">
            <form className="w-full text-lg">
            <FieldGroup>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel className="text-base" htmlFor="form-name">
                    Name
                  </FieldLabel>
                  <Input
                    id="form-name"
                    type="text"
                    placeholder="Evil Rabbit"
                    required
                    className="h-11 text-base md:text-base"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-base" htmlFor="form-email">
                    Email
                  </FieldLabel>
                  <Input
                    id="form-email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 text-base md:text-base"
                  />
                  <FieldDescription>
                    We'll never share your email with anyone.
                  </FieldDescription>
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel className="text-base" htmlFor="form-password">
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="form-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      required
                      className="h-11 pr-20 text-base md:text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 text-base"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff className="size-5" />
                      ) : (
                        <FiEye className="size-5" />
                      )}
                    </button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel className="text-base" htmlFor="form-phone">
                    Phone
                  </FieldLabel>
                  <Input
                    id="form-phone"
                    type="tel"
                    placeholder="0987654321"
                    className="h-11 text-base md:text-base"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-base" htmlFor="form-country">
                    Location
                  </FieldLabel>
                  <Select>
                    <SelectTrigger
                      id="form-country"
                      className="!h-11 !w-full text-base md:text-base"
                    >
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field orientation="horizontal">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </Field>
            </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SuperAdminCreateAdmin;
